/// !cdk-integ *
import * as sns from 'aws-cdk-lib/aws-sns';
import { App, Fn, NestedStack, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

// references between siblings

class ProducerNestedStack extends NestedStack {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.topic = new sns.Topic(this, 'MyTopic');
  }
}

class ConsumerNestedStack extends NestedStack {
  constructor(scope: Construct, id: string, topic: sns.Topic) {
    super(scope, id);

    const consumerTopic = new sns.Topic(this, 'ConsumerTopic');
    // just shorten because display name is limited
    (consumerTopic.node.defaultChild as sns.CfnTopic).displayName = `Consuming ${Fn.select(2, Fn.split('-', topic.topicName))}`;
  }
}

class ParentStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const nested = new ProducerNestedStack(this, 'Nested1');
    new ConsumerNestedStack(this, 'Nested2', nested.topic);
  }
}

const app = new App();

new ParentStack(app, 'nested-stacks-refs3-siblings');

app.synth();
