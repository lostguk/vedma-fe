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
import { toggleModal } from "src/store/slices/modals/slice"
import { useDispatch, useSelector } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import axiosClient from "src/core/axios-client"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { AddressSuggestions } from "react-dadata"
import { COLORS, ICON_NAMES, MODAL_NAMES } from "src/core/constants"

import { Card } from "./OrderCard"

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
]

export const OrderPage = () => {
  const dispatch = useDispatch()

  const { cart, user } = useSelector((state) => state.global)

  const [isRegLoading, setIsRegLoading] = useState(false)

  const [isOrderLoading, setIsOrderLoading] = useState(false)

  const [isRegNeed, setIsRegNeed] = useState(!Boolean(user))

  const [promoCode, setPromoCode] = useState("")

  const [paymentType, setPaymentType] = useState("robo")

  const [selectedOption, setSelectedOption] = useState(null)

  const onSubmit = async (data) => {
    setIsOrderLoading(true)
    console.log(data)

    axiosClient
      .post("/order", {
        items: cart.map(({ id, count }) => ({ id, count })),
        register: isRegNeed,
        ...data,
      })
      .finally(() => setIsOrderLoading(false))

    if (isRegNeed) {
      setIsRegLoading(true)

      axiosClient
        .post("/register", {
          ...data,
          address: data.address.unrestricted_value,
        })
        .finally(() => setIsRegLoading(false))
    }
  }

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Введите корректный адрес электронной почты")
      .required("Поле является обязательным"),
    password: !isRegNeed
      ? undefined
      : Yup.string().required("Поле является обязательным"),
    password_confirmation: !isRegNeed
      ? undefined
      : Yup.string()
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
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: user?.email,
      phone: user?.phone.replaceAll(" ", "-"),
      address: user?.address,
      last_name: user?.last_name,
      first_name: user?.first_name,
      middle_name: user?.middle_name,
    },
  })

  useEffect(() => {
    if (Boolean(user)) {
      setIsRegNeed(false)
      setValue("email", user?.email)
      setValue("phone", user?.phone.replaceAll(" ", "-"))
      setValue("address", user?.address)
      setValue("last_name", user?.last_name)
      setValue("first_name", user?.first_name)
      setValue("middle_name", user?.middle_name)
    }
  }, [user])

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
                onClick={() => {
                  if (!user?.first_name) {
                    dispatch(
                      toggleModal({
                        name: MODAL_NAMES.authModal,
                        isOpen: true,
                      }),
                    )
                  }
                }}
              >
                {user?.first_name || "Есть аккаунт (Войти)"}
              </Box>
            </Box>

            {!Boolean(user) && (
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
                    onChange={() => setIsRegNeed(!isRegNeed)}
                    checked={isRegNeed}
                    label="Да"
                    color="white"
                  />

                  <Radio
                    name="isReg"
                    value={false}
                    onChange={() => setIsRegNeed(!isRegNeed)}
                    checked={!isRegNeed}
                    label="Нет"
                    color="white"
                  />
                </Box>
              </Box>
            )}

            <Box>
              <form id="order-form" onSubmit={handleSubmit(onSubmit)}>
                <Box direction="column" gap="40px">
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
                          <Box direction="column" width="100%">
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

                    {isRegNeed && (
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
                    <Controller
                      name="address"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <AddressSuggestions
                          customInput={Input}
                          defaultQuery={value}
                          token={import.meta.env.VITE_DADATA_TOKEN}
                          value={value}
                          onChange={(suggestion) =>
                            onChange(suggestion ? suggestion.value : "")
                          }
                          inputProps={{
                            placeholder: "Адрес доставки",
                            error: errors?.address?.message,
                          }}
                        />
                      )}
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
                </Box>
              </form>
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
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Введите промокод"
              />

              <Button variant="black">Применить</Button>

              <Button
                type="submit"
                form="order-form"
                isLoading={isOrderLoading || isRegLoading}
              >
                Оформить заказ
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
