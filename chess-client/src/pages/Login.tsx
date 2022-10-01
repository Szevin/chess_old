import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'
import React from 'react'
import { useForm } from 'react-hook-form'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  const [showPassword, setShowPassword] = React.useState(false)
  const togglePassword = () => setShowPassword((prevState) => !prevState)

  const onSubmit = async () => {

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="email">Email cím*</FormLabel>
        <Input
          id="email"
          {...register('email', {
            pattern: { value: emailRegex, message: 'Hibás email cím' },
            required: 'Email megadása kötelező',
          })}
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => (
            <FormLabel className="error" htmlFor="email">
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
            {...register('password', {
              required: 'Jelszó megadása kötelező',
            })}
          />
          <InputRightElement width="4.5rem">
            <Button size="md" onClick={togglePassword}>
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <ErrorMessage
          errors={errors}
          name="password"
          render={({ message }) => (
            <FormLabel className="error" htmlFor="password">
              {message}
            </FormLabel>
          )}
        />
      </FormControl>
      <Button colorScheme="teal" size="sm" type="submit" marginTop={2}>
        Bejelentkezés
      </Button>
    </form>
  )
}

export default Login
