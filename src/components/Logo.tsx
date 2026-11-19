import logo from './stata-logo.svg?raw'
import mark from './stata-mark.svg?raw'

// Логотип STATA. Цвет берётся из color родителя (currentColor)
export default function Logo({
  variant = 'full',
  height,
}: {
  variant?: 'full' | 'mark'
  height: number
}) {
  return (
    <span
      role="img"
      aria-label="STATA"
      style={{ display: 'inline-block', height, lineHeight: 0 }}
      // SVG — наш собственный файл из проекта, не пользовательские данные
      dangerouslySetInnerHTML={{
        __html: (variant === 'full' ? logo : mark).replace(
          '<svg ',
          `<svg height="${height}" `,
        ),
      }}
    />
  )
}
