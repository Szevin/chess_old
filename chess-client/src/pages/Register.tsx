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
import { useAppDispatch } from '../store'
import { setUser } from '../store/redux/user'
import { useCreateUserMutation } from '../store/rest/user'

const Register = () => {
  const form = useForm()
  const navigate = useNavigate()
  const toast = useToast()
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  const [createUser] = useCreateUserMutation()
  const dispatch = useAppDispatch()

  const [showPassword, setShowPassword] = React.useState(false)
  const togglePassword = () => setShowPassword((prevState) => !prevState)

  const onSubmit = async (formData: any) => {
    const user = await createUser(formData)
    if (!('data' in user)) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
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
