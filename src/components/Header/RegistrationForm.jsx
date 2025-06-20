import React, { useState } from "react"
import { Box, Button, Input, PhoneInput } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { COLORS } from "src/core/constants"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { AddressSuggestions } from "react-dadata"
import "react-dadata/dist/react-dadata.css"
import axiosClient from "src/core/axios-client"

export const RegistrationForm = ({ modalStates, setModalState }) => {
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Введите корректный адрес электронной почты")
      .required("Поле email обязательно для заполнения"),
    password: Yup.string().required("Поле пароль обязательно для заполнения"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Пароли не совпадают")
      .min(8, "Минимальная длина пароля 8 символов")
      .required("Пароль является обязательным"),
    phone: Yup.string()
      .required("Поле email обязательно для заполнения")
      .matches(
        /^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/,
        "Введите корректный телефон",
      ),
    last_name: Yup.string().required("Пароль является обязательным"),
    first_name: Yup.string().required("Пароль является обязательным"),
    middle_name: Yup.string().required("Пароль является обязательным"),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    const response = await axiosClient.post("/register", {
      ...data,
    })
  }

  return (
    <Box padding="32px" direction="column" color="black">
      <Box fontSize="40px" color="#292929" marginBottom="16px">
        Зарегистрироваться
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box gap="8px" wrap="wrap">
          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Фамилия"
                  error={errors?.last_name?.message}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Имя"
                  error={errors?.first_name?.message}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="middle_name"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Отчество"
                  error={errors?.middle_name?.message}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="phone"
              error={errors?.email?.phone}
              control={control}
              render={({ field }) => (
                <Box direction="column" maxWidth="100%">
                  <PhoneInput
                    error={Boolean(errors?.phone?.message)}
                    placeholder="+7(___) ___ __ __"
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
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                    ]}
                  />
                  {errors?.phone?.message && (
                    <Box
                      marginTop="4px"
                      paddingLeft="8px"
                      color="red"
                      fontSize="12px"
                    >
                      {errors?.phone?.message}
                    </Box>
                  )}
                </Box>
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
                  error={errors?.email?.message}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Пароль"
                  type="password"
                  error={errors?.password?.message}
                  {...field}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
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
        </Box>

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

        <Button width="100%" type="submit" variant="black">
          Зарегистрироваться
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
        <Box cursor="pointer" onClick={() => setModalState(modalStates.login)}>
          Войти
        </Box>
      </Box>
    </Box>
  )
}
