# Kafka

## 教程（简版）

- 下载 kafka

```shell
# https://kafka.apache.org/documentation/#quickstart
curl https://mirrors.bfsu.edu.cn/apache/kafka/2.7.0/kafka_2.13-2.7.0.tgz
```

- 配置环境

```shell
bin/zookeeper-server-start.sh config/zookeeper.properties
```

```shell
bin/kafka-server-start.sh config/server.properties
```

- 创建主题事件

```shell
bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
```

- 查看主题情况

```shell
bin/kafka-topics.sh --describe --topic quickstart-events --bootstrap-server localhost:9092
```

- 在主题下生产消息

```shell
bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
```

- 消费指定主题下的消息

```shell
bin/kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092
```

- 清理环境

```shell
rm -rf /tmp/kafka-logs /tmp/zookeeper
```

## References

- [1] quickstart: https://kafka.apache.org/documentation/#quickstart
