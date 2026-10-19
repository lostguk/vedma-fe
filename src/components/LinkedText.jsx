const URL_PATTERN = /https?:\/\/[^\s]+/gi

function trimUrl(raw) {
	const match = raw.match(/^(.*?)([.,;:!?)\]]+)$/)
	if (!match || !match[1]) return { url: raw, tail: '' }
	return { url: match[1], tail: match[2] }
}

export default function LinkedText({ text }) {
	if (!text) return null

	const pattern = new RegExp(URL_PATTERN.source, 'gi')
	const urls = text.match(pattern) || []
	const parts = text.split(pattern)
	const nodes = []

	parts.forEach((part, index) => {
		if (part) nodes.push(<span key={`t-${index}`}>{part}</span>)
		const raw = urls[index]
		if (!raw) return
		const { url, tail } = trimUrl(raw)
		nodes.push(
			<a
				key={`u-${index}`}
				href={url}
				target='_blank'
				rel='noopener noreferrer'
			>
				{url}
			</a>,
		)
		if (tail) nodes.push(<span key={`p-${index}`}>{tail}</span>)
	})

	return nodes
}
