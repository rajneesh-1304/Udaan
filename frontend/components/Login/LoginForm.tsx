"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {
  Divider,
} from "@mui/material";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { auth, db, gitProvider, provider } from "../../app/config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@//redux/store";
import { loginThunk, registerThunk, signInWithGoogleThunk } from "@//redux/features/users/userSlice";
import { useAppSelector } from "@//redux/hooks";
import { signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { Typography } from "@mui/material";
import "./login.css";

const LoginUserSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, { message: "Password is required" }),
});

type LoginFormInputs = z.infer<typeof LoginUserSchema>;

interface UserState {
  users?: LoginFormInputs[];
  isAuthenticated?: boolean;
}

interface RootState {
  users?: UserState;
}

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const err = useAppSelector((state: any) => state.users.error)
  const currentUser = useAppSelector((state: any) => state.users.currentUser)

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSignIn = async () => {
      if(googleLoading){
        return;
      }
      setGoogleLoading(true);
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();
        
        if (!user.email) {
          throw new Error("Google account has no email");
        }
  
        const registerData = {
          email: user.email,
          firstName: user.displayName,
          tokenId: token,
        };
  
        const registerResponse=await dispatch(signInWithGoogleThunk(registerData)).unwrap();
        console.log(registerResponse,'---')
      if (registerResponse.message !== 'User Signed in successfully') {
        await signOut(auth);
        throw new Error("Registration failed");
      } else {
      setSnackbarMessage("User signed in successfully");
      setSnackbarOpen(true);
      router.push('/')
      }
    } catch (err: any) {
      await signOut(auth);
      console.log(err, 'error is here ')
      const message =
        err?.message?.includes("email-already-in-use") ||
          err?.response?.data?.message?.includes("Email already registered")
          ? "User already exists, please login"
          : err?.message || "Registration failed";

      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
    finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormInputs) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = response.user;
      const token = await user.getIdToken();

      const loginData = {
        email: data.email,
        tokenId: token,
      }
      const loginResponse = await dispatch(loginThunk(loginData));

      if (loginThunk.fulfilled.match(loginResponse)) {
          setSnackbarMessage("Login successful!");
          setSnackbarOpen(true);
          setTimeout(() => router.push('/'), 1200);
      } else {
        await signOut(auth);
        setSnackbarMessage(err);
        setSnackbarOpen(true);
      }

    } catch (error: any) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div className="main-form">

      <form className="formm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className='register_heading'>Sign in</h1>

        <Button fullWidth
          variant="outlined" onClick={handleSignIn} disabled={googleLoading} className="signin" sx={{ fontSize: "16px" }}>
          {googleLoading ? "Signing in..." : (
            <>
              <FcGoogle style={{ height: "30px", marginRight: "5px", }} />
              Sign In With Google
            </>
          )}
        </Button>

        <Typography className="terms-text" style={{ fontSize: '12px', marginTop: '15px', marginBottom: "10px", textAlign: 'center' }}>
          By clicking Continue, you agree to LinkedIn’s
          <span className="blue-link"> User Agreement</span>,
          <span className="blue-link"> Privacy Policy</span>, and
          <span className="blue-link"> Cookie Policy</span>.
        </Typography>

        <Divider>or</Divider>


        <Box sx={{ display: "flex", flexDirection: "column", width: 320, gap: 2.5, mt: 1, padding: 1, paddingBottom: 1 }}>
          <FormControl variant="standard">
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <Button fullWidth
                variant="contained" disabled={loading}
                className="signin-btn" style={{marginTop:'5px', fontSize:"14px"}} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Box>
      </form>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMessage}
      />
      <div className="register">
        <p>
          New to LinkedIn?{" "}
          <span className="register_link" onClick={() => router.push("/register")}>
            Join Now
          </span>
        </p>
      </div>
    </div>
  );
}
