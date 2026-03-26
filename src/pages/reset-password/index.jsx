import { useEffect, useState } from "react"
import axiosClient from "src/core/axios-client"
import { useLocation } from 'react-router-dom'
import { Box, Button, Input, Container } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { toast } from "react-toastify"

export const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const [isSuccess, setIsSuccess] = useState(false)

  const location = useLocation()
  
  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get('token')

  const email = queryParams.get('email')

  const schema = Yup.object().shape({
    password: Yup.string().required("Поле является обязательным")
             .min(8, "Минимальная длина пароля 8 символов"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Пароли не совпадают")
      .min(8, "Минимальная длина пароля 8 символов")
      .required("Поле является обязательным"),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = data => {
      setIsLoading(true)

      axiosClient
        .post("/reset-password", {
            ...data,
            email,
            token,
        })
        .then((res) => {
          setIsSuccess(true)
        })
        .catch(res => toast.error(res.response.data.message))
        .finally(() => setIsLoading(false))
  }
  
  return (
    <Box padding="48px 0 72px">
      <Container>
        {!(isSuccess) ? (
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Box direction='column' align="center" gap="16px" width="100%" justify="center">
              <Box fontSize="36px" marginBottom="16px" >
                Задайте новый пароль
              </Box>
              
              <Box width="300px"> 
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input
                          placeholder="Новый пароль"
                          type="password"
                          error={errors?.password?.message}
                          {...field}
                        />
                    )}
                  />
              </Box>

              <Box width="300px">
                <Controller
                  name="password_confirmation"
                  control={control}
                  render={({ field }) => (
                      <Input
                        type="password"
                        placeholder="Подтвердите пароль"
                        error={errors?.password_confirmation?.message}
                        {...field}
                      />
                  )}
                />
              </Box>

              
              <Button
                width="300px"
                type="submit"
                isLoading={isLoading}
              >
                Изменить пароль
              </Button>
            </Box>
          </form>
        ) : (
          <Box justify="center" fontSize="36px" width="100%">
            Пароль успешно изменен!
          </Box>
        )}
      </Container>
    </Box>
  )
}
