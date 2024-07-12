import React, { useState } from "react";
//css
import "../assets/css/login.css";
//images
import LOGO from "../assets/images/LOGO.png";
import { Form, Formik } from "formik";
//API
import { authLogin } from "../services/apiRest.js";
//Navegador de páginas
import { useNavigate } from "react-router-dom";

//Guardar token
function Login() {
  const history = useNavigate();
  const [showError, setShowError] = useState(false);

  return (
    <Formik
      initialValues={{
        name: "",
        password: "",
      }}
      onSubmit={async (values) => {
        // console.log(values);
        try {
          const dataAuth = await authLogin(values);
          //console.log(values);
          const admin = dataAuth.data.admin;
          if (admin === 1) {
            history("/usuarios", {
              state: { tokenO: dataAuth.data.accessToken },
            });
            //history('/orden', {state: {idUsuario: dataAuth.data.id}});
            //console.log(dataAuth.data.accessToken)
          } else {
            history("/ordenuser", {
              state: {
                idUsuario: dataAuth.data.id,
                token: dataAuth.data.accessToken,
              },
            });
          }
        } catch (error) {
          console.log(error);
          setShowError(true);
        }
      }}
    >
      {({ handleChange, handleSubmit }) => (
        <>
          <div className="wrapper fadeInDown">
            <div id="formContent">
              <div className="fadeIn first">
                <img src={LOGO} id="icon" alt="User Icon" />
              </div>
              <Form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="fadeIn second"
                  name="name"
                  placeholder="Usuario"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  className="fadeIn third"
                  name="password"
                  placeholder="Contraseña"
                  onChange={handleChange}
                />
                <input type="submit" className="fadeIn fourth" value="Log In" />
              </Form>
            </div>
            <div>
              <br></br>
              <br></br>
              {showError && (
                <p className="text-danger">
                  {" "}
                  Usuario o contraseña incorrectos. Inténtalo nuevamente.
                </p>
              )}
            </div>
            <br></br>
          </div>
        </>
      )}
    </Formik>
  );
}

export default Login;
