import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <>
      <h1>Страница не найдена</h1>
      <p className="page-lead">
        Такого адреса нет. <Link to="/tasks">Перейти к задачам</Link>
      </p>
    </>
  )
}
