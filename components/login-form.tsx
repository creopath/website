"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { loginSchema, type LoginFormValues } from "@/lib/schemas/login"
import { login } from "@/lib/auth/actions"
import { Link, useRouter } from "@/i18n/navigation"

export default function LoginForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const t = useTranslations("Auth")
  const tValidation = useTranslations("Auth.validation")
  const router = useRouter()

  const translateValidation = (
    key: string | undefined
  ): string | undefined => {
    if (!key) return undefined
    return tValidation(key as Parameters<typeof tValidation>[0])
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: LoginFormValues) {
    setSubmitError(null)
    const result = await login(data.email, data.password)
    if (result.error) {
      // The action returns a validation key (e.g. "invalidCredentials").
      setSubmitError(translateValidation(result.error) ?? t("genericError"))
      return
    }
    // Logged in — go to the account page.
    router.push("/account")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="login-email">{t("emailLabel")}</FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError>
                  {translateValidation(fieldState.error?.message)}
                </FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="login-password">
                {t("passwordLabel")}
              </FieldLabel>
              <Input
                {...field}
                id="login-password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError>
                  {translateValidation(fieldState.error?.message)}
                </FieldError>
              ) : null}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="text-sm">
        <Link
          href="/reset-password"
          className="font-semibold text-brand-deep-red hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? t("loggingIn") : t("loginButton")}
      </Button>

      {submitError ? (
        <p
          className="text-center text-sm text-destructive"
          role="alert"
          aria-live="assertive"
        >
          {submitError}
        </p>
      ) : null}
    </form>
  )
}
