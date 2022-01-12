import { Button, Callout, FormGroup, InputGroup } from "@blueprintjs/core"
import React, { useContext, useState } from "react"
import { UserContext } from "./context/UserContext"

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userContext, setUserContext] = useContext(UserContext)

    const formSubmitHandler = e => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        const genericErrorMessage = "Something went wrong! Please try again later."

        fetch(process.env.REACT_APP_API_ENDPOINT + "users/signup", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password }),
        })
            .then(async response => {
                setIsSubmitting(false)
                if (!response.ok) {
                    if (response.status === 400) {
                        setError("Please fill all the fields correctly!")
                    } else if (response.status === 401) {
                        setError("Invalid username and password combination.")
                    } else if (response.status === 500) {
                        console.log(response)
                        const data = await response.json()
                        if (data.message) setError(data.message || genericErrorMessage)
                    } else {
                        setError(genericErrorMessage)
                    }
                } else {
                    const data = await response.json()
                    setUserContext(oldValues => {
                        return { ...oldValues, token: data.token }
                    })
                }
            })
            .catch(error => {
                setIsSubmitting(false)
                setError(genericErrorMessage)
            })
    }

    return (
        <>
            {error && <Callout intent="danger">{error}</Callout>}
            <form onSubmit={formSubmitHandler} className="auth-form">
                <FormGroup label="Username" labelFor="username">
                    <InputGroup
                        id="username"
                        placeholder="Username"
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                    />
                </FormGroup>
                <FormGroup label="Password" labelFor="password">
                    <InputGroup
                        id="password"
                        placeholder="Password"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                    />
                </FormGroup>
                <Button
                    intent="primary"
                    disabled={isSubmitting}
                    text={`${isSubmitting ? "Registering" : "Register"}`}
                    fill
                    type="submit"
                />
            </form>
        </>
    )
}

export default Register