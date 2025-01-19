import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import '../index.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500'>
        <div className="p-5 flex gap-10 h-30">
          <Link to="/" className="btn
                      hover:bg-terc
                      hover:border-terc rounded-lg
                      border-sec no-underline w-70 h-70
                      bg-sec
                      text-prim content-center text-3xl font-bold">
            Group
          </Link>{' '}
        </div>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})