import React from "react"
import { Box, Link, Container, Button, Icon, Input } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { COLORS } from "src/core/constants"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import axiosClient from "src/core/axios-client"

export const LoginForm = ({ modalStates, setModalState }) => {
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Введите корректный адрес электронной почты")
      .required("Поле email обязательно для заполнения"),

    password: Yup.string().required("Поле пароль обязательно для заполнения"),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async ({ email, password }) => {
    const response = await axiosClient.post("/login", {
      email,
      password,
    })

    console.log(response)
  }
  return (
    <Box padding="32px" direction="column">
      <Box fontSize="40px" color="#292929" marginBottom="16px">
        Войти
      </Box>

      <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
        <Box direction="column" gap="8px">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Email"
                error={errors?.email?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="password"
            type="password"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Пароль"
                error={errors?.password?.message}
                {...field}
              />
            )}
          />
        </Box>

        <Box
          color={COLORS.main}
          fontWeight={600}
          opacity="0.5"
          fronSize="13px"
          justify="flex-end"
          margin="8px 0 64px"
          cursor="pointer"
          onClick={() => setModalState(modalStates.resetPassword)}
        >
          Забыли пароль?
        </Box>

        <Button width="100%" type="submit" from="loginForm" variant="black">
          Войти
        </Button>
      </form>

      <Box
        color={COLORS.main}
        fontWeight={600}
        opacity="0.5"
        fronSize="18px"
        justify="center"
        marginTop="12px"
        cursor="pointer"
        onClick={() => setModalState(modalStates.regisration)}
      >
        Зарегистрироваться
      </Box>
    </Box>
  )
}
