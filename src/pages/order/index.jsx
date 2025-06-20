import React, { useEffect, useState } from "react"
import {
  Button,
  Container,
  Box,
  Input,
  Icon,
  Radio,
  PhoneInput,
  SelectUI,
} from "src/components"
import { useDispatch, useSelector } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { AddressSuggestions } from "react-dadata"
import { COLORS, ICON_NAMES } from "src/core/constants"

import { Card } from "./OrderCard"

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
]

const OrderPage = () => {
  const dispatch = useDispatch()

  const { cart } = useSelector((state) => state.global)

  const [regNeed, setRegNeed] = useState(true)

  const [paymentType, setPaymentType] = useState("robo")

  const [selectedOption, setSelectedOption] = useState(null)

  const onSubmit = async (data) => {
    const response = await axiosClient.post("/register", {
      ...data,
    })
  }

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

  return (
    <Box background="white" padding="48px 0 72px">
      <Container>
        <Box width="100%" gap="40px">
          <Box width="calc(70% - 40px)" direction="column" gap="32px">
            <Box fontSize="44px" fontWeight="600" color="#181E39">
              Оформить заказ
            </Box>

            <Box align="center">
              <Box
                width="30px"
                height="30px"
                borderRadius="5px"
                background={COLORS.main}
                justify="center"
                align="center"
              >
                <Icon name={ICON_NAMES.customer} />
              </Box>

              <Box
                marginLeft="12px"
                fontWeight="400"
                fontSize="20px"
                color="#000"
              >
                Покупатель
              </Box>

              <Box
                cursor="pointer"
                marginLeft="auto"
                color={COLORS.main}
                fontSize="16px"
                fontWeight="600"
              >
                Есть аккаунт (Войти)
              </Box>
            </Box>

            <Box
              width="100%"
              borderRadius="20px"
              background="#0A0D1B"
              padding="24px 32px"
            >
              <Box fontSize="16px" fontWeight="600">
                Зарегистрироваться ?
              </Box>

              <Box marginLeft="auto" gap="40px">
                <Radio
                  name="isReg"
                  value={true}
                  onChange={() => setRegNeed(!regNeed)}
                  checked={regNeed}
                  label="Да"
                  color="white"
                />

                <Radio
                  name="isReg"
                  value={false}
                  onChange={() => setRegNeed(!regNeed)}
                  checked={!regNeed}
                  label="Нет"
                  color="white"
                />
              </Box>
            </Box>

            <Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box gap="8px" wrap="wrap">
                  <Box width="calc(33.3333% - 6px)">
                    <Controller
                      name="last_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          width="100%"
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
                        <Box direction="column" maxWidth="100%" width="100%">
                          <PhoneInput
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
                            <Box marginTop="4px" paddingLeft="8px" color="red">
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

                  {regNeed && (
                    <>
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
                    </>
                  )}
                </Box>
              </form>
            </Box>

            <Box align="center">
              <Box
                width="30px"
                height="30px"
                borderRadius="5px"
                background={COLORS.main}
                justify="center"
                align="center"
              >
                <Icon name={ICON_NAMES.address} />
              </Box>

              <Box
                marginLeft="12px"
                fontWeight="400"
                fontSize="20px"
                color="#000"
              >
                Адрес доставки
              </Box>
            </Box>

            <Box>
              <AddressSuggestions
                customInput={Input}
                token="578ca240caa601f95c0e78bcc3c2b57aeff7c907"
              />
            </Box>

            <Box align="center">
              <Box
                width="30px"
                height="30px"
                borderRadius="5px"
                background={COLORS.main}
                justify="center"
                align="center"
              >
                <Icon name={ICON_NAMES.delivery} />
              </Box>

              <Box
                marginLeft="12px"
                fontWeight="400"
                fontSize="20px"
                color="#000"
              >
                Доставка
              </Box>
            </Box>

            <Box width="100%" maxWidth="600px">
              <SelectUI
                value={selectedOption}
                onChange={setSelectedOption}
                options={options}
                placeholder="Выберите способ доставки"
              />
            </Box>

            <Box align="center">
              <Box
                width="30px"
                height="30px"
                borderRadius="5px"
                background={COLORS.main}
                justify="center"
                align="center"
              >
                <Icon name={ICON_NAMES.payment} />
              </Box>

              <Box
                marginLeft="12px"
                fontWeight="400"
                fontSize="20px"
                color="#000"
              >
                Оплата
              </Box>
            </Box>

            <Box width="100%" gap="40px">
              <Radio
                name="payment"
                value="robo"
                onChange={() => setPaymentType("robo")}
                checked={paymentType === "robo"}
                label="Робокасса"
                color="#000"
              />

              <Radio
                name="payment"
                value="manager"
                onChange={() => setPaymentType("manager")}
                checked={paymentType === "manager"}
                label="Согласовать оплату по телефону с менеджером"
                color="#000"
              />
            </Box>
          </Box>

          <Box
            width="30%"
            borderRadius="20px"
            padding="16px"
            direction="column"
            border="4px solid #F4F5F7!important"
          >
            <Box
              fontSize="16px"
              fontWeight="600"
              color="#000000"
              marginBottom="12px"
            >
              Корзина
            </Box>

            <Box direction="column" gap="16px">
              {!cart.length ? (
                <Box color="#000" margin="0 auto">
                  Корзина пуста
                </Box>
              ) : (
                cart.map((item) => (
                  <Box>
                    <Card {...item} />
                  </Box>
                ))
              )}
            </Box>

            <Box
              fontSize="16px"
              fontWeight="400"
              color="#000000"
              justify="flex-end"
              marginBottom="8px"
              marginTop="16px"
            >
              Предварительная стоимость: 28 000₽
            </Box>

            <Box
              fontSize="16px"
              fontWeight="400"
              color="#000000"
              justify="flex-end"
              marginBottom="12px"
            >
              Доставка СДЭК до ПВЗ: 650₽
            </Box>

            <Box
              fontSize="20px"
              fontWeight="900"
              color="#000000"
              justify="flex-end"
              marginBottom="24px"
            >
              Итого: 28 650₽
            </Box>

            <Box direction="column" gap="8px">
              <Input placeholder="Введите промокод" />

              <Button variant="black">Применить</Button>

              <Button>Оформить заказ</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default OrderPage
