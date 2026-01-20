import React, { useState } from "react"
import { Box, Button, Input } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import axiosClient from "src/core/axios-client"
import { toast } from "react-toastify"
import { useBreakpoints } from "src/core/hooks"

export const ChangePasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { phone } = useBreakpoints()

  const schema = Yup.object().shape({
    current_password: Yup.string().required(
      "Поле пароль обязательно для заполнения",
    ),
    new_password: Yup.string().required("Пароль является обязательным"),
    new_password_confirmation: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Пароли не совпадают")
      .min(8, "Минимальная длина пароля 8 символов")
      .required("Пароль является обязательным"),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    const response = await axiosClient
      .post("/change-password", {
        ...data,
      })
      .then(() => {
        toast.success("Пароль успешно изменен")
        reset()
      })
      .catch((res) => {
        toast.error(res.response.data.message)
        reset()
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Box gap="8px" wrap="wrap" width="100%">
        <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
          <Controller
            name="current_password"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Текущий пароль"
                error={errors?.current_password?.message}
                {...field}
              />
            )}
          />
        </Box>

        <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
          <Controller
            name="new_password"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Новый пароль"
                error={errors?.new_password?.message}
                {...field}
              />
            )}
          />
        </Box>

        <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
          <Controller
            name="new_password_confirmation"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Подтвердите новый пароль"
                error={errors?.new_password_confirmation?.message}
                {...field}
              />
            )}
          />
        </Box>
      </Box>

      <Box gap="16px" marginTop="40px">
        <Button
          isLoading={isLoading}
          width="auto"
          type="submit"
          variant="primary"
        >
          Изменить пароль
        </Button>
      </Box>
    </form>
  )
}
