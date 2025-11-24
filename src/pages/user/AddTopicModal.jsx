import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Modal } from "react-responsive-modal"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, TextArea, AddMedia, Input } from "src/components"
import axiosClient from "src/core/axios-client"

import { MediaButton } from "./styled"

export const AddTopicModal = ({ toggleModal, isModalOpen, refetchTopics }) => {
  const [isLoading, setIsLoading] = useState(false)

  const [files, setFiles] = useState([])

  const schema = Yup.object().shape({
      title: Yup.string().required("Поле является обязательным"),
      content: Yup.string().required("Поле является обязательным"),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  })
  
  const onSubmit = (data) => {
    axiosClient
      .post(`/topics`, {
        content: data.content,
        title: data.title,
        attachments: files.length ? files : undefined,
      },
      {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      })
      .then(() => {
        toggleModal(false)
        refetchTopics()
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Modal
      styles={{
        modal: {
          borderRadius: "30px",
          width: "100%",
          maxWidth: "700px",
        },
      }}
      open={isModalOpen}
      onClose={() => toggleModal(false)}
    > 
      <Box padding="16px" width='100%'>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <Box direction="column" gap="8px">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Название темы"
                  error={
                    errors?.title?.message
                  }
                  {...field}
                />
              )}
            />
            
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder="Введите сообщение..."
                  error={
                    errors?.content?.message
                  }
                />
              )}
            />

            <Box justify="flex-end" width="100%" marginTop="16px" gap="16px">
              <AddMedia
                setFiles={(newFiles) =>
                  setFiles((prev) => [...prev, ...newFiles])
                }
              >
                <MediaButton>Прикрепить файл&nbsp;{Boolean(files.length) && `(${files.length})`}</MediaButton>
              </AddMedia>

              <Button
                isLoading={isLoading}
                type="submit"
              >
                Создать тему
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
