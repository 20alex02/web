<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="user">
    {
    "id": <xsl:value-of select="@id"/>,
    "username": "<xsl:value-of select="username"/>",
    "handle": "<xsl:value-of select="handle"/>",
    "email": "<xsl:value-of select="email"/>",
    "password": "<xsl:value-of select="password"/>",
    "messages": [
        <xsl:apply-templates select="messages/message"/>
    ]
    }<xsl:if test="position()!=last()">,</xsl:if>
    </xsl:template>

    <xsl:template match="message">
    {
    "id": "<xsl:value-of select="@id"/>",
    "thread_id": "<xsl:value-of select="@thread_id"/>",
    "sent": "<xsl:value-of select="@sent"/>",
    "reply_to": <xsl:choose>
                    <xsl:when test="@reply_to">"<xsl:value-of select="@reply_to"/>"</xsl:when>
                    <xsl:otherwise>null</xsl:otherwise>
                </xsl:choose>,
    "edited": <xsl:choose>
                <xsl:when test="@edited=1">true</xsl:when>
                <xsl:otherwise>false</xsl:otherwise>
            </xsl:choose>,
    "message": "<xsl:value-of select="normalize-space()"/>"
    }<xsl:if test="position()!=last()">,</xsl:if>
    </xsl:template>
</xsl:stylesheet>