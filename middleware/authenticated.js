export default function({ store, redirect, route }) {
  if (!store.state.auth.isLoggedIn) {
    return redirect('/')
  }
}
