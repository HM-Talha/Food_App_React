import './style.scss'

export const PrimaryButton = ({title, onClick, classNames}) => {
  return (
    <button onClick={onClick} className={`primary-button ${classNames}`}>{title}</button>
  )
}
