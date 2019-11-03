import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
	iconButton: {
		padding: 10,
	},
	input: {
		width: '95%',
		padding: theme.spacing(0, 2),
	},
	search: {
		display: 'flex',
		justifyContent: 'space-between',
		margin: theme.spacing(1),
	},
	chip: {
		margin: theme.spacing(0.5, 0.5),
	},
	chips: {
		margin: theme.spacing(1),
	}
}));

function SearchBar(props) {
	const classes = useStyles();
	const [values, setValues] = React.useState({
		keyword: '',
		types: props.filters.types
	});
	const [openFilter, setOpenFilter] = React.useState(false);

	React.useEffect(() => setValues({...values, types: props.filters.types}), [props.filters])
	function handleChangeTypes(type) {
		let newtypes = values.types;
		newtypes[type] = !values.types[type];
		let newvalues = { ...values, newtypes };
		setValues(newvalues);
		props.onChange(newvalues);
	}

	const handleChange = name => event => {
		let newvalues = { ...values, [name]: event.target.value }
		setValues(newvalues);
		props.onChange(newvalues);
	};

	return (
		<div>
			<Paper className={classes.search}>
				<InputBase
					className={classes.input}
					value={values.keyword}
					placeholder="Search"
					onChange={handleChange('keyword')}
				/>
				<IconButton className={classes.iconButton} aria-label="Search">
					<Icon>search</Icon>
				</IconButton>
				<IconButton onClick={() => setOpenFilter(!openFilter)} className={classes.iconButton} aria-label="Search">
					<Icon>filters</Icon>
				</IconButton>
			</Paper>
			{openFilter && <div className={classes.chips}>
				{Object.keys(values.types).map((type, i) => <Chip
					key={i}
					label={type}
					onDelete={() => handleChangeTypes(type)}
					className={classes.chip}
					color={values.types[type] ? "primary" : "default"}
					deleteIcon={values.types[type] ? null : <Icon>done</Icon>}
				/>)}
			</div>}
		</div>
	);
}

export default SearchBar;
