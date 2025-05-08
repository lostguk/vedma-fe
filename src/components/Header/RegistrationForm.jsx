import React, { useState } from "react"
import { Box, Link, Container, Button, Icon, Input } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { COLORS } from "src/core/constants"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import MaskedInput from "react-text-mask"

export const RegistrationForm = () => {
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Введите корректный адрес электронной почты")
      .required("Поле email обязательно для заполнения"),

    password: Yup.string().required("Поле пароль обязательно для заполнения"),
  })

  const [value, setValue] = useState("")

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({})

  const onSubmit = (data) => console.log(data)

  return (
    <Box padding="32px" direction="column">
      <Box fontSize="40px" color="#292929" marginBottom="16px">
        Войти
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box gap="8px" wrap="wrap">
          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  id="my-date-input"
                  {...field}
                  mask={[
                    "+",
                    "7",
                    "(",
                    /[1-9]/,
                    /\d/,
                    /\d/,
                    ")",
                    " ",
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Фамилия"
                  error={errors?.email?.firstName}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Отчество"
                  error={errors?.email?.middleName}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="+7 (___) ___-__-__"
                  error={errors?.email?.phone}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Email"
                  error={errors?.email?.phone}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="password"
              type="password"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Пароль"
                  error={errors?.password?.password}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="confirmPassword"
              type="password"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Подтвердите пароль"
                  error={errors?.password?.confirmPassword}
                  {...field}
                />
              )}
            />
          </Box>
        </Box>

        <Box
          color={COLORS.main}
          fontWeight={600}
          opacity="0.5"
          fronSize="13px"
          justify="flex-end"
          margin="8px 0 64px"
          cursor="pointer"
        >
          Забыли пароль?
        </Box>

        <Button width="100%" type="submit" variant="black">
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
      >
        Зарегистрироваться
      </Box>
    </Box>
  )
}
