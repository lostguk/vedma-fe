import React, { useState, useEffect } from "react"
import { Box, Button, TextArea, AddMedia } from "src/components"
import axiosClient from "src/core/axios-client"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchTopics,
  fetchTopic,
  resetCurrentTopic,
} from "src/store/slices/chat/slice"
import { useBreakpoints } from "src/core/hooks"

import { AddTopicModal } from './AddTopicModal'
import { MediaButton, MessageCount } from "./styled"
import { COLORS } from "src/core/constants"

export const Chat = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { phone } = useBreakpoints()
  
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false)

  const [files, setFiles] = useState([])

  const dispatch = useDispatch()

  const [message, setMessage] = useState("")

  const { items, currentTopic } = useSelector((state) => state.chat)

  const toggleTopicModal = (isOpen) => setIsCreateTopicModalOpen(isOpen)

  const selectTopicHandler = (id) => dispatch(fetchTopic(id))

  const backToThemesHandler = () => dispatch(resetCurrentTopic())

  const sendMessage = () => {
    setIsLoading(true)

    axiosClient
      .post(`/topics/${currentTopic?.id}/messages`, {
        content: message,
        attachments: files.length ? files : undefined,
      },
      {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      })
      .then(() => {
        selectTopicHandler(currentTopic?.id)
      })
      .finally(() => {
        setIsLoading(false)
        setFiles([])
        setMessage("")
      })
  }

  useEffect(() => {
    dispatch(fetchTopics())

    const chatInterval = setInterval(() => {
      if(currentTopic?.id){
        dispatch(fetchTopic(currentTopic?.id))

        dispatch(fetchTopics())
      }
    }, 5000)

    return () => {
        clearInterval(chatInterval)
    };
  }, [])

  return (
    <Box direction="column" width="100%" align="flex-start">
      
      {isCreateTopicModalOpen && (
        <AddTopicModal refetchTopics={() => dispatch(fetchTopics())}  toggleModal={toggleTopicModal} isModalOpen={isCreateTopicModalOpen} />
      )}

      {Boolean(currentTopic) ? (
        <Button onClick={backToThemesHandler}>Назад к темам</Button>
      ) : (
        <Button onClick={() => toggleTopicModal(true)}>Создать новую тему</Button>
      )}

      {Boolean(items.length) && !currentTopic && (
        <Box wrap="wrap" gap="8px" marginTop="32px">
          {items.map(({ id, title, unread_messages_count }) => (
            <Button
              variant="secondary"
              key={id}
              onClick={() => selectTopicHandler(id)}
            >
              <Box whiteSpace="nowrap" position="relative">
                {unread_messages_count > 0 && (
                  <MessageCount top="-15px" right="-25px">
                    {unread_messages_count}
                  </MessageCount>
                )}
                
                {title}
              </Box>
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
            {currentTopic.messages.map(({ id, content, user, attachments }) => (
              <Box
                padding="12px"
                background="#181e39"
                borderRadius="10px"
                maxWidth="70%"
                key={id}
                alignSelf={user?.is_admin ? "flex-start" : "flex-end"}
                marginBottom="8px"
                direction="column"
              >
                <Box marginBottom="4px">
                  {content}
                </Box>

                {Boolean(attachments?.length) && attachments.map(({ file_name, url }) => (
                  <Box margin="2px 0" color={COLORS.main}>
                    <a href={url} target="_blank">
                      {file_name}
                    </a>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>

          <TextArea
            value={message}
            placeholder="Введите сообщение..."
            onChange={(e) => setMessage(e.target.value)}
          />

          <Box justify="flex-end" width="100%" marginTop="16px" gap="16px" direction={phone ? "column" : 'row'}>
            <AddMedia
              setFiles={
                (newFiles) => {
                  setFiles((prev) => [...prev, ...newFiles])
                }
              }
            >
              <MediaButton set>Прикрепить файл&nbsp;{Boolean(files.length) && `(${files.length})`}</MediaButton>
            </AddMedia>

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
