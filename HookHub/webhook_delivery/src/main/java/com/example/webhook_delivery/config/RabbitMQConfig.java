package com.example.webhook_delivery.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String DLX_EXCHANGE = "webhook.dlx.exchange";
    public static final String QUEUE_RETRY_10S = "webhook.retry.10s";
    public static final String QUEUE_RETRY_30S = "webhook.retry.30s";
    public static final String QUEUE_RETRY_1M = "webhook.retry.1m";
    public static final String QUEUE_RETRY_5M = "webhook.retry.5m";
    public static final String QUEUE_RETRY_15M = "webhook.retry.15m";
    public static final String QUEUE_DELIVERY = "webhook.delivery.queue";

    @Value("${app.rabbitmq.queue}")
    private String queueName;

    @Value("${app.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.routingkey}")
    private String routingKey;


    @Bean
    public Exchange exchange() {
        if (routingKey != null && (routingKey.contains("*") || routingKey.contains("#"))) {
            return new TopicExchange(exchangeName);
        } else {
            return new DirectExchange(exchangeName);
        }
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DLX_EXCHANGE);
    }

    @Bean
    public Queue deliveryQueue() {
        return QueueBuilder.durable(queueName)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", QUEUE_RETRY_10S)
                .build();
    }

    @Bean
    public Queue retryQueue10s() {
        return QueueBuilder.durable(QUEUE_RETRY_10S)
                .withArgument("x-dead-letter-exchange", exchangeName)
                .withArgument("x-dead-letter-routing-key", routingKey)
                .withArgument("x-message-ttl", 10000L) // 10 seconds
                .build();
    }

    @Bean
    public Queue retryQueue30s() {
        return QueueBuilder.durable(QUEUE_RETRY_30S)
                .withArgument("x-dead-letter-exchange", exchangeName)
                .withArgument("x-dead-letter-routing-key", routingKey)
                .withArgument("x-message-ttl", 30000L) // 30 seconds
                .build();
    }

    @Bean
    public Queue retryQueue1m(){
        return QueueBuilder.durable(QUEUE_RETRY_1M)
                .withArgument("x-dead-letter-exchange", exchangeName)
                .withArgument("x-dead-letter-routing-key", routingKey)
                .withArgument("x-message-ttl", 60000L) // 1 minute
                .build();
    }

    @Bean
    public Queue retryQueue5m(){
        return QueueBuilder.durable(QUEUE_RETRY_5M)
                .withArgument("x-dead-letter-exchange", exchangeName)
                .withArgument("x-dead-letter-routing-key", routingKey)
                .withArgument("x-message-ttl", 300000L) // 5 minutes
                .build();
    }

    @Bean
    public Queue retryQueue15m(){
        return QueueBuilder.durable(QUEUE_RETRY_15M)
                .withArgument("x-dead-letter-exchange", exchangeName)
                .withArgument("x-dead-letter-routing-key", routingKey)
                .withArgument("x-message-ttl", 900000L) // 15 minutes
                .build();
    }

    @Bean
    public Binding deliveryBinding() {
        Exchange ex = exchange();
        if (ex instanceof DirectExchange) {
            return BindingBuilder.bind(deliveryQueue()).to((DirectExchange) ex).with(routingKey);
        } else {
            return BindingBuilder.bind(deliveryQueue()).to((TopicExchange) ex).with(routingKey);
        }
    }

    @Bean
    public Binding retry10sBinding() {
        return BindingBuilder.bind(retryQueue10s()).to(deadLetterExchange()).with(QUEUE_RETRY_10S);
    }

    @Bean
    public Binding retry30sBinding() {
        return BindingBuilder.bind(retryQueue30s()).to(deadLetterExchange()).with(QUEUE_RETRY_30S);
    }

    @Bean
    public Binding retry1mBinding() {
        return BindingBuilder.bind(retryQueue1m()).to(deadLetterExchange()).with(QUEUE_RETRY_1M);
    }

    @Bean
    public Binding retry5mBinding() {
        return BindingBuilder.bind(retryQueue5m()).to(deadLetterExchange()).with(QUEUE_RETRY_5M);
    }

    @Bean
    public Binding retry15mBinding() {
        return BindingBuilder.bind(retryQueue15m()).to(deadLetterExchange()).with(QUEUE_RETRY_15M);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }
}
