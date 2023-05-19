<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="event">
    {
    "id": <xsl:value-of select="@id"/>,
    "eventname": "<xsl:value-of select="eventname"/>",
    "date": "<xsl:value-of select="date"/>",
    "location": "<xsl:value-of select="location"/>",
    "description": "<xsl:value-of select="description"/>",
    "attendees": [
        <xsl:apply-templates select="attendees/attendee"/>
    ]
    }<xsl:if test="position()!=last()">,</xsl:if>
    </xsl:template>

    <xsl:template match="attendee">
    {
    "id": <xsl:value-of select="@id"/>,
    "username": "<xsl:value-of select="@username"/>"
    }<xsl:if test="position()!=last()">,</xsl:if>
    </xsl:template>
</xsl:stylesheet>