
import { styled } from '@stitches/react';

export const Container = styled('div', {
    maxWidth: '32rem',
    margin: '0 auto',
    padding: '1.5rem',
});

export const Title = styled('h1', {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
});

export const Form = styled('form', {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
});

export const Input = styled('input', {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
});

export const Button = styled('button', {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    variants: {
        color: {
            green: { backgroundColor: '#28a745', color: 'white' },
            blue: { backgroundColor: '#007bff', color: 'white' },
            red: { backgroundColor: '#dc3545', color: 'white' },
        },
    },
    defaultVariants: {
        color: 'green',
    },
});

export const Label = styled('label', {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
});

export const Select = styled('select', {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
});

// Zones with different borders
export const ZoneGreen = styled('div', {
    border: '1px solid #28a745',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
});

export const ZoneYellow = styled('div', {
    border: '1px solid #ffc107',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
});

export const ZoneRed = styled('div', {
    border: '1px solid #dc3545',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
});