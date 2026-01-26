import React, { useState } from "react"
import { Box, Button, Input, PhoneInput } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { COLORS } from "src/core/constants"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { AddressSuggestions } from "react-dadata"
import axiosClient from "src/core/axios-client"
import { useBreakpoints } from "src/core/hooks"

export const RegistrationForm = ({ modalStates, setModalState }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const { table, phone } = useBreakpoints()

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Введите корректный адрес электронной почты")
      .required("Поле является обязательным"),
    password: Yup.string().required("Поле является обязательным"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Пароли не совпадают")
      .min(8, "Минимальная длина пароля 8 символов")
      .required("Поле является обязательным"),
    phone: Yup.string()
      .required("Поле является обязательным")
      .matches(
        /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
        "Введите корректный телефон",
      ),
    last_name: Yup.string().required("Поле является обязательным"),
    first_name: Yup.string().required("Поле является обязательным"),
    middle_name: Yup.string().required("Поле является обязательным"),
    address: Yup.object()
      .required("Введите адрес")
      .test(
        "is-full-address",
        "Выберите полный адрес",
        (value) => {
          if (!value || !value.data) return false;
          const { street, house, city } = value.data;
          return Boolean(street && house && city);
        }
    ),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)

    axiosClient
      .post("/register", {
        ...data,
        address: data.address.value,
      })
      .then(() => {
        setModalState(modalStates.registrationSuccess)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Box padding={table ? "32px" : '8px'} direction="column" color="black">
      <Box fontSize={table ? "40px" : "24px"} color="#292929" marginBottom="16px">
        Зарегистрироваться
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box gap="8px" wrap="wrap">
          <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
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

          <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
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

          <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
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

          <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
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
                      " ",
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

          <Box width={phone ? "100%" : "calc(66.6666% - 6px)"} >
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

          <Box width="100%">
            <Controller
              name="address"
              control={control}
              render={({ field: { onChange, value } }) => (
                <AddressSuggestions
                  customInput={Input}
                  token={import.meta.env.VITE_DADATA_TOKEN}
                  value={value}
                  onChange={onChange}
                  inputProps={{
                    placeholder: "Адрес доставки",
                    error: errors?.address?.message,
                  }}
                />
              )}
            />
          </Box>

          <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
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

          <Box width={phone ? "100%" : "calc(33.3333% - 6px)"}>
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

        <Button
          width="100%"
          type="submit"
          variant="black"
          isLoading={isLoading}
        >
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
