import React, { useEffect } from "react"
import { Box, Button, Input } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { COLORS } from "src/core/constants"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import axiosClient, { setToken } from "src/core/axios-client"
import { setUser } from "src/store/slices/global/slice"
import { useDispatch } from "react-redux"

export const LoginForm = ({ modalStates, setModalState, setModalOpen }) => {
  const dispatch = useDispatch()

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Введите корректный адрес электронной почты")
      .required("Поле email обязательно для заполнения"),

    password: Yup.string()
      .required("Поле пароль обязательно для заполнения")
      .min(8, "Минимальная длинна пароля - 8 символов"),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
    clearErrors,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = ({ email, password }) => {
    axiosClient
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        const response = res.data.data

        console.log(response)

        setToken(response.token)

        dispatch(setUser(response.user))

        setModalOpen(false)
      })
      .catch((err) => {
        setError("global", {
          type: "custom",
          message: err?.response?.data?.message,
        })
      })
  }

  useEffect(() => {
    clearErrors("global")
  }, [watch("email"), watch("password")])

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
            defaultValue="user@example.com"
            render={({ field }) => (
              <Input
                placeholder="Email"
                error={
                  errors?.email?.message || Boolean(errors?.global?.message)
                }
                {...field}
              />
            )}
          />

          <Controller
            name="password"
            type="password"
            control={control}
            defaultValue="password123"
            render={({ field }) => (
              <Input
                placeholder="Пароль"
                error={
                  errors?.password?.message || Boolean(errors?.global?.message)
                }
                {...field}
              />
            )}
          />
        </Box>

        {errors?.global?.message && (
          <Box marginTop="4px" paddingLeft="8px" color="red">
            {errors?.global?.message}
          </Box>
        )}
        <Box
          color={COLORS.main}
          fontWeight={600}
          opacity="0.5"
          fronSize="13px"
          justify="flex-end"
          margin="8px 0 64px"
        >
          <Box
            cursor="pointer"
            onClick={() => setModalState(modalStates.resetPassword)}
          >
            Забыли пароль?
          </Box>
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
      >
        <Box
          cursor="pointer"
          onClick={() => setModalState(modalStates.registration)}
        >
          Зарегистрироваться
        </Box>
      </Box>
    </Box>
  )
}
