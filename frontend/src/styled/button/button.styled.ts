import styled from "styled-components";

export const StyledButton = styled("button")<any>`
  background: ${(p) => (p.disabled ? "#ccc" : p.color || "#2E186A")};
  color: ${(p) => (p.disabled ? "#555" : p.color ? "#2E186A" : "#fff")};
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  border: 1px solid #edf3f5;
  border-radius: 4px;
  padding: 13px 0;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  max-width: 180px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 16px 30px rgb(23 31 114 / 20%);

  &:hover,
  &:active,
  &:focus {
    color: #fff;
    border: ${(p) =>
      p.disabled ? "1px solid #ccc" : "1px solid rgb(255, 130, 92)"};
    background-color: ${(p) => (p.disabled ? "#ccc" : "rgb(255, 130, 92)")};
  }
`;
