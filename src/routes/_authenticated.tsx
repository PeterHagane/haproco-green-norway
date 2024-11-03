import { createFileRoute, redirect } from "@tanstack/react-router"
import { pb } from "../stores/PocketBaseProvider"


export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ location }) => {
      if (!pb.authStore.isValid) {
        throw redirect({
          to: '/login',
          search: {
            // Use the current location to power a redirect after login
            // (Do not use `router.state.resolvedLocation` as it can
            // potentially lag behind the actual current location)
            redirect: location.href,
          },
        })
      }
    },
  })