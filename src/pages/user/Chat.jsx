import React, { useState, useEffect } from "react"
import { Box, Button, TextArea } from "src/components"
import axiosClient from "src/core/axios-client"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchTopics,
  fetchTopic,
  resetCurrentTopic,
} from "src/store/slices/chat/slice"

export const Chat = () => {
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const [message, setMessage] = useState("")

  const { items, currentTopic } = useSelector((state) => state.chat)

  useEffect(() => {
    dispatch(fetchTopics())
  }, [])

  const selectTopicHandler = (id) => dispatch(fetchTopic(id))

  const backToThemesHandler = () => dispatch(resetCurrentTopic())

  const sendMessage = () => {
    setIsLoading(true)
    axiosClient
      .post(`/topics/${currentTopic?.id}/messages`, {
        content: message,
      })
      .then(() => {
        selectTopicHandler(currentTopic?.id)
        setMessage("")
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Box direction="column" width="100%" align="flex-start">
      {Boolean(currentTopic) ? (
        <Button onClick={backToThemesHandler}>Назад к темам</Button>
      ) : (
        <Button>Создать новую тему</Button>
      )}

      {Boolean(items.length) && !currentTopic && (
        <Box wrap="wrap" gap="8px" marginTop="32px">
          {items.map(({ id, title }) => (
            <Button
              variant="secondary"
              key={id}
              onClick={() => selectTopicHandler(id)}
            >
              <Box whiteSpace="nowrap">{title}</Box>
            </Button>
          ))}
        </Box>
      )}

      {currentTopic && (
        <>
          <Box
            marginTop="32px"
            marginBottom="24px"
            wrap="wrap"
            padding="32px 16px 0"
            borderRadius="10px"
            border="2px solid white!important"
            width="100%"
            minHeight="300px"
            direction="column"
          >
            {currentTopic.messages.map(({ id, content, user }) => (
              <Box
                padding="12px"
                background="#181e39"
                borderRadius="10px"
                maxWidth="70%"
                key={id}
                alignSelf={user?.is_admin ? "flex-start" : "flex-end"}
                marginBottom="8px"
              >
                {content}
              </Box>
            ))}
          </Box>

          <TextArea
            value={message}
            placeholder="Введите сообщение..."
            onChange={(e) => setMessage(e.target.value)}
          />

          <Box justify="flex-end" width="100%" marginTop="16px">
            <Button
              disabled={!Boolean(message)}
              onClick={sendMessage}
              isLoading={isLoading}
            >
              Отправить
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
