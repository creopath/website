"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { validatePhoneNumberLength } from "libphonenumber-js"
import * as RPNInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void
  }

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn(
        "flex overflow-hidden rounded-md transition-[box-shadow] focus-within:ring-3 focus-within:ring-white/30",
        className
      )}
      international
      countryCallingCodeEditable={false}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      value={value || undefined}
      onChange={(newValue) => {
        // Truncate input that exceeds the selected country's max length.
        // The library's input is partially uncontrolled, so we must emit a
        // shorter value to force a re-render that overwrites the over-typed
        // characters. Returning early would leave the typed characters visible.
        let acceptedValue = newValue
        while (
          acceptedValue &&
          acceptedValue.length > 1 &&
          validatePhoneNumberLength(acceptedValue) === "TOO_LONG"
        ) {
          acceptedValue = acceptedValue.slice(0, -1) as RPNInput.Value
        }
        onChange?.(acceptedValue || ("" as RPNInput.Value))
      }}
      {...props}
    />
  )
})
PhoneInput.displayName = "PhoneInput"

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, onBeforeInput, ...props }, ref) => {
  const handleBeforeInput = (e: React.InputEvent<HTMLInputElement>) => {
    // Block digit insertion that would push the value past the country's max length.
    // We intercept here (before insertion) because rejecting in onChange doesn't
    // reliably re-render the library's partially uncontrolled input.
    const incoming = e.data
    if (incoming && /\d/.test(incoming)) {
      const input = e.currentTarget
      const start = input.selectionStart ?? input.value.length
      const end = input.selectionEnd ?? input.value.length
      const projected =
        input.value.slice(0, start) + incoming + input.value.slice(end)
      if (validatePhoneNumberLength(projected) === "TOO_LONG") {
        e.preventDefault()
        return
      }
    }
    onBeforeInput?.(e)
  }

  return (
    <Input
      className={cn(
        "rounded-s-none rounded-e-md focus-visible:border-input focus-visible:ring-0",
        className
      )}
      {...props}
      ref={ref}
      onBeforeInput={handleBeforeInput}
    />
  )
})
InputComponent.displayName = "InputComponent"

type CountryEntry = { label: string; value: RPNInput.Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  options: CountryEntry[]
  onChange: (country: RPNInput.Country) => void
}

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) setSearchValue("")
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-1 rounded-s-md rounded-e-none border-r-0 border-input! bg-brand-cloud! px-2.5 text-base font-normal text-foreground shadow-xs hover:bg-white hover:text-foreground focus:z-10 focus-visible:ring-0 active:translate-y-0 aria-expanded:bg-white aria-expanded:text-foreground md:text-sm"
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "-mr-2 size-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-75 p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value)
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    "[data-radix-scroll-area-viewport]"
                  )
                  if (viewportElement) {
                    viewportElement.scrollTop = 0
                  }
                }
              }, 0)
            }}
            placeholder="Search country..."
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country
  onChange: (country: RPNInput.Country) => void
  onSelectComplete: () => void
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country)
    onSelectComplete()
  }

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={cn(
          "ml-auto size-4",
          country === selectedCountry ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

export { PhoneInput }
