import { createContext, useContext, useState } from "react"

type CreateAccountModalContext = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
]

const createAccountModalContext = createContext<CreateAccountModalContext>(null)

function CreateAccountModalProvider({ children }) {
  const [modal, setModal] = useState(false)
  return (
    <createAccountModalContext.Provider value={[modal, setModal]}>
      {children}
    </createAccountModalContext.Provider>
  )
}

const useOpenCreateAccountModal = () => {
  const setModal = useContext(createAccountModalContext)[1]
  return () => {
    setModal((_) => true)
  }
}

const useCreateAccountModelContext = (): CreateAccountModalContext => {
  return useContext(createAccountModalContext)
}

export {
  createAccountModalContext,
  CreateAccountModalProvider,
  useOpenCreateAccountModal,
  useCreateAccountModelContext
}
