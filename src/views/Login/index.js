/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import validate from 'validate.js'
import { makeStyles } from '@material-ui/styles'
import {
  Grid,
  Button,
  TextField,
  Typography
} from '@material-ui/core'

import { client } from 'config/client'
import { parseError } from 'helpers'
import { Notify } from 'helpers/notify'
import { MUTATE_LOGIN } from './query'

const schema = {
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    },
    format: {
      pattern: '[a-z0-9]+',
      flags: 'i',
      message: 'can only contain a-z and 0-9'
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/microphone.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'right',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 400
  },
  name: {
    marginTop: theme.spacing(1),
    color: theme.palette.white,
    fontSize: 16
  },
  bio: {
    color: theme.palette.white,
    fontStyle: 'italic'
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2),
    textAlign: 'left'
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}))

const Login = props => {
  const classes = useStyles()

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  })

  useEffect(() => {
    const errors = validate(formState.values, schema)

    setFormState(formState => ({
      ...formState,
      isValid: !errors,
      errors: errors || {}
    }))
  }, [formState.values])

  const handleChange = event => {
    event.persist()

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }))
  }

  const handleSignIn = async event => {
    event.preventDefault()
    await client.mutate({
      mutation: MUTATE_LOGIN,
      variables: {
        ...formState.values
      }
    }).then(res => {
      props.authentication.setToken(res.data.login.token)
      props.getUser()
      return new Notify('success', 'Đăng nhập thành công!')
    }).catch(err => new Notify('error', parseError(err)))
  }

  const hasError = field => !!(formState.touched[field] && formState.errors[field])

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant='h1'
              >
                WEBSITE QUẢN LÝ
              </Typography>

              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant='body1'
                >
                  Đặng Minh Tiến - 16521215
                </Typography>
              </div>

            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignIn}
              >
                <Typography
                  className={classes.title}
                  variant='h2'
                >
                  Đăng nhập
                </Typography>
                <Typography
                  color='textSecondary'
                  gutterBottom
                  style={{ paddingTop: 10, marginBottom: -15, marginTop: 15 }}
                >
                  Đăng nhập với mạng xã hội
                </Typography>

                <Typography
                  align='center'
                  className={classes.sugestion}
                  color='textSecondary'
                  variant='body1'
                >
                  hoặc bằng tài khoản người dùng
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('username')}
                  fullWidth
                  helperText={
                    hasError('username') ? formState.errors.username[0] : null
                  }
                  label='Tên tài khoản'
                  name='username'
                  onChange={handleChange}
                  type='text'
                  value={formState.values.username || ''}
                  variant='outlined'
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label='Mật khẩu'
                  name='password'
                  onChange={handleChange}
                  type='password'
                  value={formState.values.password || ''}
                  variant='outlined'
                />
                <Button
                  className={classes.signInButton}
                  color='primary'
                  disabled={!formState.isValid}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                >
                  ĐĂNG NHẬP
                </Button>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default withRouter(Login)
