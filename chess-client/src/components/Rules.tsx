import React from 'react'
import { Text } from '@chakra-ui/react'
import { Rule } from 'chess-common/lib/Board'
import useTranslate from '../hooks/useTranslate'

const Rules = ({ rules, timeout, frequency, round }: { rules: Rule[], timeout: number, frequency: number, round: number }) => {
  const t = useTranslate()

  if (!rules.length) return null

  const isCurrentlyTimeout = round % (frequency + timeout) < timeout

  const currentDuration = Math.ceil(((isCurrentlyTimeout ? timeout : (frequency + timeout)) - (round % (frequency + timeout))) / 2)

  return (
    <>
      <Text>
        {`${t('game.rule.current')}(${currentDuration}): `}
        {!isCurrentlyTimeout ? t(`game.rule.${rules[Math.floor((round / (frequency + timeout)) % rules.length)]}`) : t('game.rule.timeout')}
      </Text>
      <Text>
        {`${t('game.rule.next')}: `}
        {isCurrentlyTimeout ? t(`game.rule.${rules[(Math.floor((round / (frequency + timeout)) + 1) % rules.length)]}`) : t('game.rule.timeout')}
      </Text>
    </>
  )
}

export default Rules
