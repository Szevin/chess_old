import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useCreateUserMutation, useLoginUserMutation } from '../store/rest/user'

const Register = () => {
  const form = useForm()
  const navigate = useNavigate()
  const toast = useToast()
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  const [submitRegister] = useCreateUserMutation()
  const [login] = useLoginUserMutation()

  const [showPassword, setShowPassword] = React.useState(false)
  const togglePassword = () => setShowPassword((prevState) => !prevState)

  const onSubmit = async (formData: any) => {
    const res = await submitRegister(formData)
    if (!('data' in res)) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    sessionStorage.setItem('user', res.data._id)
    navigate('..')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="name">Felhasználónév*</FormLabel>
        <Input
          id="name"
          {...form.register('name', { required: 'Felhasználónév megadása kötelező!' })}
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
        <FormLabel htmlFor="email">Email cím*</FormLabel>
        <Input
          id="email"
          {...form.register('email', {
            required: 'Email megadása kötelező!',
            pattern: { value: emailRegex, message: 'Hibás email cím' },
          })}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="email"
          render={({ message }) => (
            <FormLabel color="red" htmlFor="email">
              {message}
            </FormLabel>
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="password">Jelszó*</FormLabel>
        <InputGroup size="md">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...form.register('password', {
              required: 'Jelszó megadása kötelező!',
            })}
          />
          <InputRightElement width="4.5rem">
            <Button size="md" onClick={togglePassword}>
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

      <Button disabled={form.formState.isSubmitting} colorScheme="teal" size="sm" type="submit" marginTop={2}>
        Regisztráció
      </Button>
    </form>
  )
}

export default Register
