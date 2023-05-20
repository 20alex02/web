# Even More Epic Store

As a developer for a company competing with a major online game distributor, your task is to prototype a new checkout workflow for your company's online store. The goal is to make the checkout process simpler for the user. During a meeting with your product manager, you agreed on the following requirements:

## Specs

- The form will be composed of 5 steps according to the diagram in gitlab issues:

- Step 1: Order Summary
  - In this step the user will be able to review the items in their cart and the total price.
- Step 2 (optional): Select recipient
  - If the order is a gift, the user will be able to select the recipient from a list of users.
  - The list has to be searchable
- Step 3: Select payment method
  - The user will be able to select the payment method from a list of available payment methods and fill in the necessary information.
- Step 4: Fill in billing info
  - The user will be able to fill in their billing information.
- Step 5: Confirmation

  - The user will receive a confirmation message (a nice animation is appreciated).

- The user will be able to go back and forth between steps (at least a back button should be present in each step, for a better UX you would want to use **breadcrumbs** or a **stepper**, you are however not limited to these, as long as they make sense from a users' perspective).
  - However, when the user choses to gift his cart. Going back must include the *Select recipient* step. Likewise, the step must be skipped when going back if the user is not gifting the cart.

- Use proper validation for each field, and make sure the user can't submit the form if there are any errors on the current step.

- Each step of the form is required to contain the following:

  - Step 1: Order Summary
    - The user's cart
    - The total price
    - A button to buy the items for yourself
    - A button to buy the items as a gift
  - Step 2: Select recipient
    - A search bar to filter the list of users
    - A list of users
  - Step 3: Select payment method
    - A list of payment methods (At least Credit Card and 2 others)
    - A form to fill in the card information, if the user chooses to pay with a credit card (Card number, Holder's name, expiration date, CVV)
  - Step 4: Fill in billing info

    - A form to fill in the user's billing information, the fields are:

      - Name and surname (required)
      - Email (required)
      - Phone number (optional)

      - Address (required)
      - City (required)
      - State/province (required)
      - Country (required)
      - Zip code (required)

  - Step 5: Confirmation
    - A confirmation message

- When the user gets to the confirmation step, print all the information (`console.log`) required for submitting the form, using the provided `OrderFormData` type in `src/types`.

- Use to provided fake data to populate the cart and the list of users.

## Wireframes

During the meeting, you jotted down some wireframes and uploaded them to gitlab issues.

However, these are purely inspirational and feel free to experiment on your own assuming you stay within specs.

## Notes and hints

Keep in mind you are making a PoC (proof of concept), but your PM will be presenting your work to the upper management (for narrative reasons) as soon as you're done. Make it look the part! It doesn't have to be a work of a renaissance painter, but we'll make you cook here.

Feel free to use any styling tools (eg. `tailwind`, `windicss`, `unocss`, ...), component libraries (styled: `Ant Design`, `React Spectrum`, ...; unstyled: `HeadlessUI`, `React Aria`), full out component frameworks (`Material UI`, `Chakra`, ...) as well as other tools you feel might help you.

Due to company policy you are not able to use **b\*\*tstrap** and derivatives or you WILL BE FIRED!

For forms, we recommend you stick to `react-hook-form` as it is the most up to date. Other solutions include `react-final-form` and `formik`, which however haven't been updated in a long time (+2y for formik).

Both `zod` and `yup` are good choices for validation, but we recommend `zod` as it is more modern and integrates better with typescript.

## Bonus

- **\*0.5**: Add persistance to the form (meaning, when the user refreshes the page, the form should be in the same state as before the refresh, that also includes the step the user was in).
- **\*0.5**: Add transitions and animations to the form to make it more engaging (eg. when the user goes to the next step, the current step should slide out and the next step should slide in from the right, or something like that, do not make it too janky pls). Good library picks are [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://react-spring.io/), [Auto Animate](https://auto-animate.formkit.com/) might also work.