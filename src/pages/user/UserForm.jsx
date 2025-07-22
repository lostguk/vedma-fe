import React, { useState } from "react"
import { Box, Button, Input, PhoneInput } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { COLORS } from "src/core/constants"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { AddressSuggestions } from "react-dadata"
import axiosClient from "src/core/axios-client"
import { useDispatch, useSelector } from "react-redux"

export const UserForm = () => {
  const [isEdit, setIsEdit] = useState(false)

  const user = useSelector((state) => state.global.user)

  console.log(user)

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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box gap="8px" wrap="wrap">
          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="last_name"
              control={control}
              defaultValue={user?.last_name}
              render={({ field }) => (
                <Input
                  placeholder="Фамилия"
                  error={errors?.last_name?.message}
                  {...field}
                  disabled={!isEdit}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="first_name"
              control={control}
              defaultValue={user?.first_name}
              render={({ field }) => (
                <Input
                  placeholder="Имя"
                  error={errors?.first_name?.message}
                  {...field}
                  disabled={!isEdit}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="middle_name"
              control={control}
              defaultValue={user?.middle_name}
              render={({ field }) => (
                <Input
                  placeholder="Отчество"
                  error={errors?.middle_name?.message}
                  {...field}
                  disabled={!isEdit}
                />
              )}
            />
          </Box>

          <Box width="calc(33.3333% - 6px)">
            <Controller
              name="phone"
              error={errors?.email?.phone}
              defaultValue={user?.phone}
              control={control}
              render={({ field }) => (
                <Box direction="column" width="100%">
                  <PhoneInput
                    error={Boolean(errors?.phone?.message)}
                    placeholder="+7(___) ___ __ __"
                    id="my-date-input"
                    {...field}
                    disabled={!isEdit}
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
              defaultValue={user?.email}
              render={({ field }) => (
                <Input
                  placeholder="Email"
                  error={errors?.email?.message}
                  {...field}
                  disabled={!isEdit}
                />
              )}
            />
          </Box>

          {console.log(user?.address)}

          <Box width="100%">
            <Controller
              name="address"
              control={control}
              render={({ field: { onChange, value } }) => (
                <AddressSuggestions
                  customInput={Input}
                  defaultQuery={user?.address}
                  token={import.meta.env.VITE_DADATA_TOKEN}
                  value={value}
                  onChange={onChange}
                  inputProps={{
                    placeholder: "Адрес доставки",
                    error: errors?.address?.message,
                    disabled: !isEdit,
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box gap="16px" marginTop="40px">
          {isEdit ? (
            <>
              <Button width="auto" type="submit" variant="primary">
                Сохранить
              </Button>

              <Button
                width="auto"
                variant="secondary"
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setIsEdit(false)
                }}
              >
                Отмена
              </Button>
            </>
          ) : (
            <>
              <Button
                width="auto"
                variant="primary"
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setIsEdit(true)
                }}
              >
                Редактировать
              </Button>

              <Box marginLeft="auto">
                <Button
                  width="auto"
                  variant="secondary"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsEdit(true)
                  }}
                >
                  Выйти
                </Button>
              </Box>
            </>
          )}
        </Box>
      </form>
    </div>
  )
}
