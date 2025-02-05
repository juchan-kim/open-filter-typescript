import { useEffect, useState } from 'react'
import styles from './select.module.css'

type SelectOption = {
    label: string
    value: string | number
}

type MultipleSeclectProps = {
    multiple: true 
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void;
}

type SingleSeclectProps = {
    multiple?: false 
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void;
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSeclectProps | MultipleSeclectProps)

export function Select({ multiple, value, onChange, options }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)

    useEffect(() => {
        if (isOpen) {setHighlightedIndex(0)}
    }, [isOpen])

    function clearOptions () {
        multiple ? onChange([]) : onChange(undefined)
    }

    function selectOption (option : SelectOption) {
       if (multiple) {
        if (value.includes(option)) {
            onChange(value.filter(o => o !== option))
        } else {
            onChange([...value, option])
        }
       } else {
        if (value !== option) onChange(option)
       }
        
    }

    function isOptionSelected (option: SelectOption) {
        return multiple ? value.includes(option) : option === value
    }

    return (
        <div onBlur={() => setIsOpen(false)} tabIndex={0} className={styles.container} onClick={() => setIsOpen(prev => !prev)}>
            <span className={styles.value}>{multiple ? (
                value.map(v => (
                    <button 
                        key={v.value}
                        onClick={e => {
                            e.stopPropagation()
                            selectOption(v)
                        }}
                        className={styles["option-badge"]}    
                    >
                        {v.label}
                        <span className={styles["remove-button"]}>&times;</span>
                    </button>
                ))
            ) : value?.label}</span>
            <button 
                onClick={(e) => {
                    e.stopPropagation()
                    clearOptions()
                }} 
                className={styles["clear-btn"]}
            >
                &times;
            </button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                {options.map((option, index) => (
                    <li 
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={(e) => {
                            e.stopPropagation()
                            selectOption(option)
                            setIsOpen(false)
                        }} 
                        key={option.value} 
                        className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${highlightedIndex === index ? styles.highlighted : ""}`}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}