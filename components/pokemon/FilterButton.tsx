import { StyleSheet } from 'react-native';
import { TypeName } from '@/constants/PokemonTypes';

type Props = {
    value: "types",
    onChange: (v: TypeName | null) => void;
} 


export function FilterButton({value, onChange}: Props) {

}

const styles = StyleSheet.create({

});