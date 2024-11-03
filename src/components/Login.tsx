import cx from "classnames";
import css from "./Login.module.scss"
import { useRef, useState } from "react";
import ModalTabManager from "./ModalTabManager";
import { ILoginForm, usePocket, pb } from "../stores/PocketBaseProvider";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

interface ILogin {
    className?: string
    style?: React.CSSProperties
    onClick?: (param: any) => void,
    children?: React.ReactNode
}

export const loginIds = {
    userName: "username",
    password: "password"
}

export const Login = ({
    style,
    className,
    children
}:
    ILogin
) => {
    const formRef = useRef<HTMLFormElement>(null)
    // const { register, handleSubmit } = useForm<ILoginForm>()
    const { registerUser, signIn, signOut, user, isLoading, isError, isSignedIn } = usePocket()
    const navigate = useNavigate()

    const [fields, setFields] = useState<ILoginForm>({username: "", password: ""})

    const handleSignIn = async (data: ILoginForm) => {
        signIn && signIn({ username: data.username, password: data.password }).then((didSignIn) => {
            !didSignIn && navigate({ to: "/login" })
        })
    }

    const handleRegister = async (data: ILoginForm) => {
        registerUser && registerUser({ username: data.username, password: data.password }).then((didSignIn) => {
            !didSignIn && navigate({ to: "/login" })
        })
    }

    const showUser = isSignedIn
    const showForm = !isSignedIn && (!isLoading || isError)
    const showLoader = isLoading && !isError
    const showError = isError

    return <div style={style} className={cx(className)}>
        {!isSignedIn && <>
        
        </>
        }

        {showUser && <>{`Signed in as ${user?.username ? user?.username : ""} ${pb?.authStore.isAdmin ? "admin" : ""}`}</>}
        {showError && <>Error signing in.</>}
        {showLoader && <div className="loader"></div>}
        {showForm && <ModalTabManager containerRef={formRef}>
            <form 
                ref={formRef} className={cx("flex center column gap-s", css.container)}>
                <div className="inputContainer">
                    <input
                    // {...register("username")} 
                    onChange={(e)=>setFields({...fields, username: e.target.value})}
                    autoFocus className="shadow" type="username" id={loginIds.userName} placeholder="username or email" required></input>
                    <label htmlFor={loginIds.userName}>username or email</label>
                </div>
                <div className="inputContainer">
                    <input  
                    // {...register("password")}
                    onChange={(e)=>setFields({...fields, password: e.target.value})}
                    className="shadow" type="password" id={loginIds.password} placeholder="password" required></input>
                    <label htmlFor={loginIds.password}>password</label>
                </div>
                <div className={cx("flex center gap-s")}>
                    <button type="button" onClick={()=>handleSignIn(fields)} className="defaultButton small submit" value="signin">Sign in</button>
                    <button type="button" onClick={()=>handleRegister(fields)} className="defaultButton small submit" value="newuser">New user</button>
                </div>
            </form>
        </ModalTabManager>
        }

        {
            isSignedIn &&
            <button type="submit" className="defaultButton small submit" value="signout" onClick={() => {
                signOut && signOut()
            }}>signout</button>
        }

        {children}
    </div>
}