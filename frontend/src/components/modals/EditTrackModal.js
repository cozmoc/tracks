import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Icon from '@material-ui/core/Icon';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { updateTrack } from '../../actions/tracks';
import { Button, IconButton } from '@material-ui/core';
import { TextField, Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import trackTypes from '../widgets/tracktypes';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const defaultTypes = trackTypes.reduce((acc, el) => ({...acc, [el]: false}), {});

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4),
		outline: 'none',
	},
	chip: {
		margin: theme.spacing(0.5, 0.5),
	},
	br: {
		margin: theme.spacing(5, 0),
	}
}));

function EditTrackModal(props) {
	const [values, setValues] = React.useState({
		name: props.track.name,
	});
	const [types, setTypes] = React.useState({
		...props.track.types,
	});
	const [open, setOpen] = React.useState(false);
	const [modalStyle] = React.useState(getModalStyle);

	const handleClose = () => {
		setOpen(false);
		setValues({ name: '' });
		setTypes(defaultTypes);
	};

	const handleOpen = (e) => {
		e.preventDefault();
		setOpen(true);
		setValues({...props.track});
		setTypes({...props.track.types});
	}

	const handleChange = name => event => {
		setValues({ ...values, [name]: event.target.value });
	};

	const handleChangeTypes = name => event => {
		setTypes({ ...types, [name]: !types[name] });
	};

	const submit = () => {
		props.updateTrack({
			name: values.name,
			types,
			id: props.track.id
		});
		handleClose();
	};

	const classes = useStyles();

	return (
		<div>
			<IconButton onClick={handleOpen}>
				<Icon>edit</Icon>
            </IconButton>
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={open}
				onClose={handleClose}
			>
				<div style={modalStyle} className={classes.paper}>
					<Typography>Edit Track</Typography>
					<TextField
						fullWidth
						id="outlined-multiline-flexible"
						label="description"
						multiline
						error={values.name.length < 6}
						rowsMax="4"
						value={values.name}
						onChange={handleChange('name')}
						className={classNames(classes.textField, classes.br)}
						margin="normal"
						variant="outlined"
					/>
					<div>
						{Object.keys(types).map((type, i) => <Chip
							key={i}
							label={type}
							onDelete={handleChangeTypes(type)}
							className={classes.chip}
							color={types[type] ? "primary" : "default"}
							deleteIcon={types[type] ? null : <Icon>done</Icon>}
						/>)}
					</div>
					<div className={classNames(classes.br)}></div>
					<div className="row">
						<Button className="col" onClick={submit} disabled={
							values.name.length < 6 || !Object.keys(types).some(type => types[type])
						}>Update Track</Button>
						<Button className="col" onClick={handleClose}>Cancel</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default connect(null, { updateTrack })(EditTrackModal);