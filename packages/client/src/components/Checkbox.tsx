import * as React from 'react'
import styled from 'styled-components'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode
}

const Label = styled.label`
  cursor: pointer;
`

const InputCheckbox = styled.input.attrs({
  type: 'checkbox'
})``

class Checkbox extends React.PureComponent<Props> {
  render() {
    const { children, ...rest } = this.props
    return (
      <Label>
        <InputCheckbox {...rest} />
        {children}
      </Label>
    )
  }
}

export default Checkbox