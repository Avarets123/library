# Gateway

## Запросы:

### Запросы с гетвея на чат-сервис для модификации данных

Запросы на изменения данных в бд отправляются в следующую очередь со следующими параметрами

```javascript
    {
        channel: 'chat_exchange',
        routingKey: 'data:write',
    }
```

- Запрос на создание комнаты

```javascript
{
    type: 'room:create',
    body: {
        label?: 'лейбл комнаты',
        tags?: tagsArray[],
        memberId: 'memberId'
    }
}
```

- Запрос на редактирование комнаты

```javascript
{
    type: 'room:update',
    body: {
        label?: 'лейбл комнаты',
        roomId: 'roomId'
    }
}
```

- Запрос на редактирование комнат по связке тегов

```typescript
{
    type: "room:updateByTags"
    body: {
        label: "update by tags",
        tags: [
            {
                tagName: "entityType",
                value: "Order"
            },
            {
                tagName: "orderId",
                value: "orderId"
            }
        ]
    }
}
```

- Запрос на удаление комнам по связке тегов

```typescript
{
    type: 'room:deleteByTags',
    body: {
        tags: [
            {
                tagName: "entityType",
                value: "Order"
            },
            {
                tagName: "orderId",
                value: "orderId"
            }
        ]
    }
}
```

- Запров на добавление тегов в комнату

```typescript
{
    type: "room:tagsAdd"
    body: {
        roomId: "roomId",
        tags: [
            {
                "tagName": "entityType",
                "value": "Shop",
                "private": false
            }
        ]
    }
}
```

- Запрос на открепление тегов от комнаты

```javascript
{
  type: 'room:tagsRemove',
  body: {
    roomId: 'fc58100f-4603-420a-9108-09847acaf350',
    tags: [
        {
            "tagName": "entityType",
            "value": "Shop",
        }
    ]
  }
}
```

Чтобы узнать для чего нужны теги и как их использовать [прочитайте здесь](./tag.md).

- Запрос на присоединение к комнаты

```javascript
{
    type: 'room:join',
    body: {
        roomId: 'roomId',
        memberId: 'memberId'
    }
}
```

- Запрос на выход из комнаты

```javascript
{
    type: 'room:left',
    body: {
        roomId: 'roomId',
        memberId: 'memberId'
    }
}
```

- Запрос на удаление сообщения

```javascript
{
    type: 'message:remove',
    body: {
        roomId: 'roomId',
        memberId: 'memberId',
        messageId: 'messageId'
    }
}
```

- Запрос на редактирование сообщения

```javascript
{
    type: 'message:update',
    body: {
        roomId: 'roomId',
        memberId: 'memberId',
        messageId: 'messageId',
        text: 'any text',
        attachments: ['any resource', 'any resouce']
    }
}
```

В предыдущих запросах данные добавляются в очередь и по очереди будут модифицированны

### Запросы с гетвея на чат-сервис для получения данных

Для получения данных с чат-сервиса нужно отправить запрос в очередь со следующими параметрами

```javascript
    {
        channel: 'chat_exchange',
        routingKey: 'data:read',
    }
```

- Запрос на получение комнат

```javascript
{
    type: 'room:find',
    body: {
        memberId: 'memberId',
        listing?: {
            beforeId,
            afterId,
            limit,
            filter,
            allRoom?: boolean
        },
        tags?: tagsArray[]
    }
}
```

Если указать `allRoom:true` получите все комнаты, иначе только те в которых данный пользователь является участником комнаты или создателем. В зависимости от тегов получаемые комнаты могут варьироваться .

О тегах можете [прочитать здесь](./tag.md).

- Запрос на получение одной комнаты

```javascript
{
    type: 'room:read',
    body: {
        memberId: 'memberId',
        roomId: 'roomId',
        allRoom?: boolean,
        tags?: tagsArray[],
    }
}
```

- Запрос на получение сообщений

```javascript
{
    type: 'message:find',
    body: {
        memberId: 'memberId',
        listing?: {
            beforeId,
            afterId,
            limit,
            filter
        },
    }
}
```

## События

При подписке на события в гетвее надо указать следующие параметры в `rmq`

```javascript
    {
        channel: 'chat_exchange',
        routingKey: 'event:subscribe',
        queue: 'gateway.queue:event'

    }
```

Все события будут приходит в эту очередь

### Типы событий

- Комната удалена

```javascript
    {
        type: 'room:deleted',
        body: {
            roomId: 'roomId'
        }
    }
```

- Пользователь покинул комнату

```javascript
    {
        type: 'room:lefted',
        body: {
            roomId: 'roomId',
            memberId: 'memberId'
        }
    }
```

- Сообщение удалено

```javascript
    {
        type: 'message:removed',
        body: {
            roomId: 'roomId',
            memberId: 'memberId',
            messageId: 'messageId'
        }
    }
```

- Комната создана

```javascript
    {
        type: 'room:created',
        body: {
            ...newRoom
        }
    }
```

- Комната отредактирована

```typescript
    {
    type: 'room:updated',
    body: {
        roomId: 'roomId'
        }
    }
```

- Комнаты по тегам отредактированы

```typescript
{
    type: "room:updatedByTags"
    body: {
        tags: [
            {
                tagName: "entityType",
                value: "Order"
            },
            {
                tagName: "orderId",
                value: "orderId"
            }
        ],
        roomsIds: ['room updated id', 'room updated id']
    }
}
```

- Теги добавлены в комнату

```typescript
{
  type: 'room:tagsAdded',
  body: {
     roomId: 'roomId'
    }
}
```

- Теги удалены у комнаты

```typescript
{
  type: 'room:tagsRemoved',
  body: {
    roomId: 'fc58100f-4603-420a-9108-09847acaf350',
    tags: [
        {
            "tagName": "entityType",
            "value": "Shop",
        }
     ]
  }
}
```

- Комнаты по связке тегов удалены

```typescript
{
    type: 'room:deletedByTags',
    body: {
        tags: [
            {
                tagName: "entityType",
                value: "Order"
            },
            {
                tagName: "orderId",
                value: "orderId"
            }
        ],
        roomsIds: [
            "deleted room id",
            "deleted room id",
        ]
    }
}
```

```typescript
{
    type: 'room:deleteByTags',
    body: {
        tags: [
            {
                tagName: "entityType",
                value: "Order"
            },
            {
                tagName: "orderId",
                value: "orderId"
            }
        ]
    }
}
```

- Сообщение создано

```javascript
    {
        type: 'message:created',
        body: {
            ...newMessage
        }
    }
```

- Пользователь присоединился к комнате

```javascript
    {
        type: 'room:joined',
        body: {
            memberId: 'memberId',
            roomId: 'roomId',
        }
    }
```

- Статус сообщения изменился

```javascript
    {
        type: 'message:changedStatus',
        body: {
            memberId: 'memberId',
            roomId: 'roomId',
            delivered: [
                {
                    memberId: 'membemId',
                    time: 'time'
                }
            ],
            read: [
                {
                    memberId: 'membemId',
                    time: 'time'
                }
            ]
        }
    }
```
