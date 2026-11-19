import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Input } from '../components/ui'
import { useApp, type Group } from '../store/context'
import styles from './GroupsPage.module.css'

// Пока групп нет в API — показываем примеры
const EXISTING: Group[] = [
  {
    id: 'g-1',
    name: 'Квартира на Ленина',
    code: 'LENINA',
    members: 4,
    isAdmin: false,
  },
  {
    id: 'g-2',
    name: 'Команда ОПД',
    code: 'OPD-425',
    members: 6,
    isAdmin: false,
  },
]

function makeCode(name: string) {
  const base =
    name
      .replace(/[^A-Za-zА-Яа-я0-9]/g, '')
      .slice(0, 4)
      .toUpperCase() || 'GRP'
  return `${base}-${Math.floor(1000 + Math.random() * 9000)}`
}

export default function GroupsPage() {
  const { setGroup, group } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState<string>()
  const [created, setCreated] = useState<Group>()

  function create(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Введите название группы')
    const g: Group = {
      id: `g-${Date.now()}`,
      name: name.trim(),
      code: makeCode(name),
      members: 1,
      isAdmin: true,
    }
    setCreated(g)
    setGroup(g)
  }

  function choose(g: Group) {
    setGroup(g)
    navigate('/')
  }

  if (created) {
    return (
      <>
        <h1>Группа создана</h1>
        <p className="page-lead">
          Пригласите участников: отправьте им код группы.
        </p>
        <Card className={styles.created}>
          <div className="muted">Код приглашения</div>
          <div className={styles.code}>{created.code}</div>
          <p className="muted">
            Дальше админ создаёт задачи и распределяет их между участниками.
          </p>
          <Button onClick={() => navigate('/tasks')}>Перейти к задачам</Button>
        </Card>
      </>
    )
  }

  return (
    <>
      <h1>Группа</h1>
      <p className="page-lead">
        {group
          ? `Сейчас вы в группе «${group.name}». Можно выбрать другую.`
          : 'Выберите группу или создайте свою.'}
      </p>

      <div className={styles.layout}>
        <section>
          <h2>Выбрать из списка</h2>
          <div className={styles.list}>
            {EXISTING.map((g) => (
              <Card key={g.id} className={styles.item}>
                <div>
                  <b>{g.name}</b>
                  <div className="muted">{g.members} участника</div>
                </div>
                <Button
                  size="sm"
                  variant={group?.id === g.id ? 'primary' : 'secondary'}
                  onClick={() => choose(g)}
                >
                  {group?.id === g.id ? 'Вы здесь' : 'Войти'}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2>Создать группу</h2>
          <Card>
            <form className={styles.form} onSubmit={create}>
              <Input
                label="Название"
                placeholder="Например, Семья"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={error}
              />
              <div className={styles.admin}>
                <Badge tone="solid">Админ</Badge>
                <span className="muted">
                  Создатель группы становится админом: настраивает её и аукцион.
                </span>
              </div>
              <Button type="submit">Создать</Button>
            </form>
          </Card>
        </section>
      </div>
    </>
  )
}
