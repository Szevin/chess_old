import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useBoolean,
  useToast,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../store'
import { setUser } from '../store/redux/user'
import { useLoginUserMutation } from '../store/rest/user'

const Login = () => {
  const form = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  })
  const navigate = useNavigate()
  const [login] = useLoginUserMutation()
  const toast = useToast()
  const dispatch = useAppDispatch()

  const [showPassword, setShowPassword] = useBoolean(false)

  const onSubmit = async (formData: any) => {
    const user = await login({
      name: formData.name,
      password: formData.password,
    })

    if (!('data' in user)) {
      toast({
        title: 'Error',
        description: 'Invalid name or password',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    dispatch(setUser(user.data))
    navigate('..')
  }

  return (
    <Box width="360px" margin="auto">
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <FormControl>
          <FormLabel htmlFor="name">Felhasználónév*</FormLabel>
          <Input
            autoFocus
            width="97%"
            id="name"
            {...form.register('name', {
              required: 'Felhasználónév megadása kötelező!',
            })}
          />
          <ErrorMessage
            errors={form.formState.errors}
            name="name"
            render={({ message }) => (
              <FormLabel color="red" htmlFor="name">
                {message}
              </FormLabel>
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Jelszó*</FormLabel>
          <InputGroup size="md">
            <Input
              width="97%"
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...form.register('password', {
                required: 'Jelszó megadása kötelező!',
              })}
            />
            <InputRightElement width="4.5rem">
              <Button size="md" onClick={setShowPassword.toggle}>
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <ErrorMessage
            errors={form.formState.errors}
            name="password"
            render={({ message }) => (
              <FormLabel color="red" htmlFor="password">
                {message}
              </FormLabel>
            )}
          />
        </FormControl>
        <Button disabled={form.formState.isSubmitting || !form.formState.isValid} colorScheme="teal" size="sm" type="submit" marginTop={2}>
          Bejelentkezés
        </Button>
      </form>
    </Box>
  )
}

export default Login
