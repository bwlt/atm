import styled, { css } from 'styled-components'

interface Props {
  col?: number
}

const getWidthFromProps = ({ col = 24 }: Props) => {
  switch (col) {
    case  1: return '4.166666666666667%'
    case  2: return '8.333333333333334%'
    case  3: return '12.5%'
    case  4: return '16.666666666666668%'
    case  5: return '20.833333333333336%'
    case  6: return '25%'
    case  7: return '29.166666666666668%'
    case  8: return '33.333333333333336%'
    case  9: return '37.5%'
    case 10: return '41.66666666666667%'
    case 11: return '45.833333333333336%'
    case 12: return '50%'
    case 13: return '54.16666666666667%'
    case 14: return '58.333333333333336%'
    case 15: return '62.50000000000001%'
    case 16: return '66.66666666666667%'
    case 17: return '70.83333333333334%'
    case 18: return '75%'
    case 19: return '79.16666666666667%'
    case 20: return '83.33333333333334%'
    case 21: return '87.5%'
    case 22: return '91.66666666666667%'
    case 23: return '95.83333333333334%'
    default:
    case 24: return '100%'
  }
}

const spanCss = css`
  flex: 0 0 ${getWidthFromProps};
  max-width: ${getWidthFromProps};
`

const StyledCol = styled.div`
  ${(props: Props) => props.col ? spanCss : ''}
  position: relative;
  width: 100%;
  min-height: 1px;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  ${(props: Props) => props.col ? spanCss : ''}
`

export default StyledCol as React.ComponentType<Props>