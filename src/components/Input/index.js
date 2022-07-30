import styled from 'styled-components';

const TextInput = styled.input`
  width: 100%;
  height: 48px;
  font-size: ${({fontSize}) => fontSize || '14px'};
  text-indent: 16px;
  &::placeholder {
      color: #CCCCC8;
      font-weight: bold;
  }
`;

const Input = ({ placeholder, fontSize,   }) => {
  return (
    <TextInput 
        placeholder={placeholder} 
        fontSize={fontSize} 
    />
  )
}

export default Input