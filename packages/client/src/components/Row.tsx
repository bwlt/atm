import styled from 'styled-components'

import Col from './Col'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  gutter?: number
}

const StyledRow = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: ${({ gutter = 30 }: Props) => - gutter / 2}px;
  margin-left:  ${({ gutter = 30 }: Props) => - gutter / 2}px;

  & > ${Col as any} {
    padding-right: ${({ gutter = 30 }: Props) => gutter / 2}px;
    padding-left:  ${({ gutter = 30 }: Props) => gutter / 2}px;
  }
`

export default StyledRow as React.ComponentType<Props>