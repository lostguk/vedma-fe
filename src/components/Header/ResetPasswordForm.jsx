import React from "react"
import { Box, Link, Container, Button, Icon, Input } from "src/components"
import { useForm, Controller } from "react-hook-form"
import { COLORS } from "src/core/constants"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"

export const ResetPasswordForm = () => {
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Введите корректный адрес электронной почты")
      .required("Поле email обязательно для заполнения"),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => console.log(data)

  return (
    <Box padding="32px" direction="column">
      <Box fontSize="40px" color="#292929" marginBottom="16px">
        Восстановить пароль
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box direction="column" gap="8px" marginBottom="16px">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                error={errors?.email?.message}
                placeholder="Email"
                {...field}
              />
            )}
          />
        </Box>

        <Button width="100%" type="submit" from="loginForm" variant="black">
          Восстановить
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
        <div>Войти</div>&nbsp;/&nbsp;<div>Зарегистрироваться</div>
      </Box>
    </Box>
  )
}
