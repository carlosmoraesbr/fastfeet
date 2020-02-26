import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 5px;
      height: 40px;
      padding: 0 20px;
      color: #333;
      margin: 0 0 20px;

      &::placeholder {
        color: ${lighten(0.3, '#333')};
      }
    }

    span {
      color: #fb6f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }

    hr {
      border: 0px;
      height: 1px;
      background: ${lighten(0.5, '#333')};
      margin: 10px 0 20px;
    }

    button {
      margin: 5px 0 0;
      height: 40px;
      background: #3b9eff;
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 5px;
      font-size: 16px;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.03, '#3b9eff')};
      }
    }
  }

  > button {
    width: 100%;
    margin: 10px 0 0;
    height: 40px;
    background: #fb6f91;
    font-weight: bold;
    color: #fff;
    border: 0;
    border-radius: 5px;
    font-size: 16px;
    transition: background 0.2s;

    &:hover {
      background: ${darken(0.08, '#fb6f91')};
    }
  }
`;
